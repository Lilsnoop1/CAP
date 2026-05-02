"use client";

import { useEffect, useRef } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { Spinner } from "@/components/ui/spinner";

const libraries = ["places"];

/** Client bundle receives this from next.config, which maps GOOGLE_MAPS_API_KEY → NEXT_PUBLIC_…. */
function getApiKey() {
  const k = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  return typeof k === "string" ? k.trim() : "";
}

function FallbackLocationInput({
  label,
  value,
  onChange,
  placeholder,
  disabled,
  inputClassName,
  hint,
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase text-muted-foreground">
        {label}
      </p>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={
          inputClassName ||
          "w-full rounded-md bg-background-secondary px-3 py-2 text-sm outline-none ring-1 ring-border-primary focus:ring-2 focus:ring-primary"
        }
      />
      {hint ? (
        <p className="text-xs text-amber-800 dark:text-amber-300">{hint}</p>
      ) : null}
    </div>
  );
}

function PlacesLocationFieldLoaded({
  label,
  value,
  onChange,
  placeholder,
  disabled,
  inputClassName,
}) {
  const inputRef = useRef(null);
  /** Parent often passes an inline onChange; keep a ref so Autocomplete is not torn down every render. */
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const apiKey = getApiKey();
  const { isLoaded, loadError } = useJsApiLoader({
    id: "cap-admin-google-places",
    googleMapsApiKey: apiKey,
    libraries,
    preventGoogleFontsLoading: true,
  });

  useEffect(() => {
    if (!isLoaded || loadError || disabled || typeof google === "undefined") return;
    const input = inputRef.current;
    if (!input) return;

    const autocomplete = new google.maps.places.Autocomplete(input, {
      fields: ["formatted_address", "name"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      const text =
        place.formatted_address?.trim() ||
        place.name?.trim() ||
        input.value?.trim() ||
        "";
      if (text) onChangeRef.current(text);
    });

    return () => {
      google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, [isLoaded, loadError, disabled]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el || document.activeElement === el) return;
    const next = value ?? "";
    if (el.value !== next) el.value = next;
  }, [value]);

  const baseInputClass =
    inputClassName ||
    "w-full rounded-md bg-background-secondary px-3 py-2 text-sm outline-none ring-1 ring-border-primary focus:ring-2 focus:ring-primary";

  if (loadError) {
    return (
      <FallbackLocationInput
        label={label}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        inputClassName={inputClassName}
        hint="Google Maps failed to load. Check API key and enabled APIs (Maps JavaScript API, Places API)."
      />
    );
  }

  if (!isLoaded) {
    return (
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase text-muted-foreground">
          {label}
        </p>
        <div className="flex h-10 items-center gap-2 rounded-md bg-background-secondary px-3 ring-1 ring-border-primary">
          <Spinner className="h-4 w-4" />
          <span className="text-xs text-muted-foreground">Loading places…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase text-muted-foreground">
        {label}
      </p>
      <input
        ref={inputRef}
        type="text"
        defaultValue={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        className={baseInputClass}
      />
      <p className="text-[11px] text-muted-foreground">
        Search for a venue or address; pick a suggestion to save a consistent location.
      </p>
    </div>
  );
}

export default function PlacesLocationField(props) {
  const key = getApiKey();
  if (!key) {
    return (
      <FallbackLocationInput
        {...props}
        hint="Set GOOGLE_MAPS_API_KEY in .env and restart the dev server. Enable Maps JavaScript API and Places API in Google Cloud."
      />
    );
  }
  return <PlacesLocationFieldLoaded {...props} />;
}
