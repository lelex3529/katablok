'use client';

import { useState, useEffect, useCallback } from 'react';
import { Proposal } from '../types/Proposal';
import * as proposalService from '../services/proposalService';

export interface DashboardData {
  totalProposals: number;
  pendingProposals: number; // proposals with status 'sent'
  signedProposals: number; // proposals with status 'signed'
  recentProposals: Proposal[];
  loading: boolean;
  error: string | null;
}

export function useDashboardData() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalProposals: 0,
    pendingProposals: 0,
    signedProposals: 0,
    recentProposals: [],
    loading: true,
    error: null,
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      setDashboardData((prev) => ({ ...prev, loading: true, error: null }));

      // Fetch all proposals
      const proposals = await proposalService.getProposals();

      // Calculate statistics
      const totalProposals = proposals.length;
      const pendingProposals = proposals.filter(
        (p) => p.status === 'sent',
      ).length;
      const signedProposals = proposals.filter(
        (p) => p.status === 'signed',
      ).length;

      // Sort proposals by creation date (newest first) and take the most recent ones
      const recentProposals = [...proposals]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 5); // Take 5 most recent proposals

      setDashboardData({
        totalProposals,
        pendingProposals,
        signedProposals,
        recentProposals,
        loading: false,
        error: null,
      });
    } catch (err) {
      setDashboardData((prev) => ({
        ...prev,
        loading: false,
        error:
          err instanceof Error ? err.message : 'Failed to fetch dashboard data',
      }));
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    ...dashboardData,
    refreshDashboardData: fetchDashboardData,
  };
}
