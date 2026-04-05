"use client";

import { Check, X, Infinity } from "lucide-react";

interface Feature {
  name: string;
  free: string | number | boolean;
  reflect: string | number | boolean;
  thrive: string | number | boolean;
}

const features: Feature[] = [
  {
    name: "Monthly Journal Entries",
    free: 30,
    reflect: 90,
    thrive: "Unlimited",
  },
  {
    name: "Personalized Goals",
    free: 3,
    reflect: 10,
    thrive: "Unlimited",
  },
  {
    name: "Cloud Sync (All Devices)",
    free: true,
    reflect: true,
    thrive: true,
  },
  {
    name: "Rich Media Attachments",
    free: false,
    reflect: true,
    thrive: true,
  },
  {
    name: "AI Coaching Tools",
    free: false,
    reflect: false,
    thrive: true,
  },
];

export default function FeatureComparisonTable() {
  const renderValue = (value: string | number | boolean) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="h-5 w-5 text-primary mx-auto" />
      ) : (
        <X className="h-5 w-5 text-on-surface-variant/30 mx-auto" />
      );
    }

    if (value === "Unlimited") {
      return (
        <div className="flex items-center justify-center gap-1 text-primary">
          <Infinity className="h-5 w-5" />
        </div>
      );
    }

    return (
      <span className="text-body-sm text-on-surface font-medium">{value}</span>
    );
  };

  return (
    <div className="w-full overflow-hidden rounded-lg bg-surface-container-low/50 backdrop-blur-sm">
      {/* Header */}
      <div className="px-6 py-4 bg-surface-container-high/30">
        <h2 className="font-manrope text-headline-sm font-bold text-on-surface">
          Feature breakdown
        </h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-container-high/20">
              <th className="px-6 py-4 text-left">
                <span className="text-label-md font-semibold text-on-surface-variant/70 uppercase tracking-wide">
                  Features
                </span>
              </th>
              <th className="px-6 py-4 text-center">
                <span className="text-label-md font-bold text-on-surface">
                  FREE
                </span>
              </th>
              <th className="px-6 py-4 text-center">
                <span className="text-label-md font-bold text-primary">
                  REFLECT
                </span>
              </th>
              <th className="px-6 py-4 text-center">
                <span className="text-label-md font-bold text-secondary">
                  THRIVE
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {features.map((feature, index) => (
              <tr
                key={index}
                className="transition-colors duration-200 hover:bg-surface-container-high/20"
              >
                <td className="px-6 py-4">
                  <span className="text-body-sm text-on-surface">
                    {feature.name}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {renderValue(feature.free)}
                </td>
                <td className="px-6 py-4 text-center">
                  {renderValue(feature.reflect)}
                </td>
                <td className="px-6 py-4 text-center">
                  {renderValue(feature.thrive)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
