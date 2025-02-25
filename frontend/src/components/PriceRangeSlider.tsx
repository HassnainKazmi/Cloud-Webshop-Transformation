import React from "react";
import { Range, getTrackBackground } from "react-range";

interface PriceRangeSliderProps {
  minPrice: number;
  maxPrice: number;
  priceRange: [number, number];
  setPriceRange: (value: [number, number]) => void;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  minPrice,
  maxPrice,
  priceRange,
  setPriceRange,
}) => {
  if (!priceRange) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
        <span>${priceRange[0].toFixed(2)}</span>
        <span>${priceRange[1].toFixed(2)}</span>
      </div>
      <Range
        step={1}
        min={minPrice}
        max={maxPrice}
        values={priceRange}
        onChange={(values) => setPriceRange([values[0], values[1]])}
        renderTrack={({ props, children }) => {
          const { key, ...restProps } = props;
          return (
            <div
              key={key}
              {...restProps}
              style={{
                height: "6px",
                width: "100%",
                background: getTrackBackground({
                  values: priceRange,
                  colors: ["#d3d3d3", "#007bff", "#d3d3d3"],
                  min: minPrice,
                  max: maxPrice,
                }),
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {children}
            </div>
          );
        }}
        renderThumb={({ props }) => {
          const { key, ...restProps } = props;
          return (
            <div
              key={key}
              {...restProps}
              style={{
                height: "16px",
                width: "16px",
                marginRight: "-20px",
                marginTop: "6px",
                backgroundColor: "#007bff",
                borderRadius: "50%",
                boxShadow: "0px 2px 6px #aaa",
              }}
            />
          );
        }}
      />
    </div>
  );
};

export default PriceRangeSlider;
