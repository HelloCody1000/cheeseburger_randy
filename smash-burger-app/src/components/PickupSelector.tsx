import React from "react";
import { Clock } from "lucide-react";
// Note: Styles for this are in App.css under .pickup-container

interface PickupSelectorProps {
  times: string[];
  selectedTime: string;
  onSelect: (time: string) => void;
}

export function PickupSelector({ times, selectedTime, onSelect }: PickupSelectorProps) {
  return (
    <div className="pickup-container">
      <div className="pickup-header">
        <Clock size={18} />
        <span>Select Pickup Time</span>
      </div>
      
      {/* Horizontal Scroll Container */}
      <div className="pickup-scroll-area">
        {times.map((time) => (
          <button
            key={time}
            onClick={() => onSelect(time)}
            className={`pickup-time-btn ${selectedTime === time ? "active" : ""}`}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
}