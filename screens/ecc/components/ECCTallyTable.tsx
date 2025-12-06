import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../../../theme/theme";

interface TallyData {
  complied: number;
  notComplied: number;
  partiallyComplied: number;
  na: number;
  total: number;
}

interface ECCTallyTableProps {
  permitHolderName: string;
  monitoringState: any;
}

/**
 * Calculate tally counts from monitoring state conditions
 */
const calculateTally = (monitoringState: any): TallyData => {
  const tally: TallyData = {
    complied: 0,
    notComplied: 0,
    partiallyComplied: 0,
    na: 0,
    total: 0,
  };

  // Get conditions from formatted data
  const conditions = monitoringState?.formatted?.conditions || [];

  conditions.forEach((condition: any) => {
    const status = condition.status?.toLowerCase() || "";

    if (status.includes("complied") && !status.includes("not") && !status.includes("partial")) {
      tally.complied++;
    } else if (status.includes("not") && status.includes("complied")) {
      tally.notComplied++;
    } else if (status.includes("partial")) {
      tally.partiallyComplied++;
    } else if (status.includes("n/a") || status === "na") {
      tally.na++;
    }

    tally.total++;
  });

  return tally;
};

/**
 * ECC Tally Table Component
 * Displays compliance status counts for a permit holder
 */
export const ECCTallyTable: React.FC<ECCTallyTableProps> = ({
  permitHolderName,
  monitoringState,
}) => {
  const tally = calculateTally(monitoringState);

  // Don't render if no conditions
  if (tally.total === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Compliance Summary - {permitHolderName}
      </Text>

      <View style={styles.table}>
        {/* Header Row */}
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, styles.headerCell, styles.statusCell]}>
            Status
          </Text>
          <Text style={[styles.cell, styles.headerCell, styles.countCell]}>
            Count
          </Text>
          <Text style={[styles.cell, styles.headerCell, styles.percentCell]}>
            Percentage
          </Text>
        </View>

        {/* Complied Row */}
        <View style={styles.row}>
          <View style={[styles.cell, styles.statusCell, styles.statusWithIndicator]}>
            <View style={[styles.indicator, styles.compliedIndicator]} />
            <Text style={styles.cellText}>Complied</Text>
          </View>
          <Text style={[styles.cell, styles.countCell, styles.cellText]}>
            {tally.complied}
          </Text>
          <Text style={[styles.cell, styles.percentCell, styles.cellText]}>
            {((tally.complied / tally.total) * 100).toFixed(1)}%
          </Text>
        </View>

        {/* Not Complied Row */}
        <View style={styles.row}>
          <View style={[styles.cell, styles.statusCell, styles.statusWithIndicator]}>
            <View style={[styles.indicator, styles.notCompliedIndicator]} />
            <Text style={styles.cellText}>Not Complied</Text>
          </View>
          <Text style={[styles.cell, styles.countCell, styles.cellText]}>
            {tally.notComplied}
          </Text>
          <Text style={[styles.cell, styles.percentCell, styles.cellText]}>
            {((tally.notComplied / tally.total) * 100).toFixed(1)}%
          </Text>
        </View>

        {/* Partially Complied Row */}
        <View style={styles.row}>
          <View style={[styles.cell, styles.statusCell, styles.statusWithIndicator]}>
            <View style={[styles.indicator, styles.partialIndicator]} />
            <Text style={styles.cellText}>Partially Complied</Text>
          </View>
          <Text style={[styles.cell, styles.countCell, styles.cellText]}>
            {tally.partiallyComplied}
          </Text>
          <Text style={[styles.cell, styles.percentCell, styles.cellText]}>
            {((tally.partiallyComplied / tally.total) * 100).toFixed(1)}%
          </Text>
        </View>

        {/* N/A Row */}
        <View style={styles.row}>
          <View style={[styles.cell, styles.statusCell, styles.statusWithIndicator]}>
            <View style={[styles.indicator, styles.naIndicator]} />
            <Text style={styles.cellText}>N/A</Text>
          </View>
          <Text style={[styles.cell, styles.countCell, styles.cellText]}>
            {tally.na}
          </Text>
          <Text style={[styles.cell, styles.percentCell, styles.cellText]}>
            {((tally.na / tally.total) * 100).toFixed(1)}%
          </Text>
        </View>

        {/* Total Row */}
        <View style={[styles.row, styles.totalRow]}>
          <Text style={[styles.cell, styles.statusCell, styles.totalText]}>
            Total Conditions
          </Text>
          <Text style={[styles.cell, styles.countCell, styles.totalText]}>
            {tally.total}
          </Text>
          <Text style={[styles.cell, styles.percentCell, styles.totalText]}>
            100%
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.primaryDark,
    marginBottom: 12,
  },
  table: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "white",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerRow: {
    backgroundColor: theme.colors.primaryDark,
  },
  totalRow: {
    backgroundColor: "#F1F5F9",
    borderBottomWidth: 0,
  },
  cell: {
    padding: 12,
    justifyContent: "center",
  },
  headerCell: {
    color: "white",
    fontWeight: "700",
    fontSize: 14,
  },
  cellText: {
    fontSize: 14,
    color: "#334155",
  },
  totalText: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.primaryDark,
  },
  statusCell: {
    flex: 2,
    borderRightWidth: 1,
    borderRightColor: "#E2E8F0",
  },
  countCell: {
    flex: 1,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#E2E8F0",
  },
  percentCell: {
    flex: 1,
    textAlign: "center",
  },
  statusWithIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  compliedIndicator: {
    backgroundColor: "#10B981", // Green
  },
  notCompliedIndicator: {
    backgroundColor: "#EF4444", // Red
  },
  partialIndicator: {
    backgroundColor: "#F59E0B", // Amber
  },
  naIndicator: {
    backgroundColor: "#94A3B8", // Gray
  },
});

