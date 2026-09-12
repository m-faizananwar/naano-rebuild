"use client";

import { createContext, useContext } from "react";
import type { CreatorDto, MarketplaceContextDto } from "../schemas";

export type BookingStep = "selection" | "offer" | "sent";
export type BookingState = { creator: CreatorDto; step: BookingStep; acceptBy?: string | null } | null;

export type MarketplaceState = {
  ctx: MarketplaceContextDto;
  isShortlisted: (creator: CreatorDto) => boolean;
  toggleShortlist: (creator: CreatorDto) => void;
  collaborationStatus: (creator: CreatorDto) => string | null;
  markInvited: (creatorId: string, status: string) => void;
  openProfile: (creator: CreatorDto) => void;
  closeProfile: () => void;
  profile: CreatorDto | null;
  booking: BookingState;
  openBooking: (creator: CreatorDto) => void;
  setBookingStep: (step: BookingStep, acceptBy?: string | null) => void;
  closeBooking: () => void;
};

export const MarketplaceContext = createContext<MarketplaceState | null>(null);

export function useMarketplace(): MarketplaceState {
  const state = useContext(MarketplaceContext);
  if (!state) throw new Error("useMarketplace must be used inside <MarketplaceProvider>");
  return state;
}
