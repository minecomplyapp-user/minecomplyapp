import { StyleSheet } from 'react-native';
import { theme } from '../../../theme/theme';
import { scale, verticalScale, moderateScale, normalizeFont, isTablet } from '../../../utils/responsive';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background,
	},
	safeContainer: {
		flex: 1,
		backgroundColor: theme.colors.background,
	},
	scrollContent: {
		paddingBottom: verticalScale(theme.spacing.lg),
	},
	header: {
		paddingHorizontal: scale(theme.spacing.md),
		paddingTop: verticalScale(theme.spacing.md),
		paddingBottom: verticalScale(theme.spacing.md),
	},
	headerTitle: {
		fontFamily: theme.typography.bold,
		fontSize: normalizeFont(isTablet() ? 24 : theme.typography.sizes.xl),
		color: theme.colors.primaryDark,
	},
	headerSubtitle: {
		fontFamily: theme.typography.regular,
		fontSize: normalizeFont(isTablet() ? 14 : theme.typography.sizes.xs),
		color: theme.colors.textLight,
		marginTop: verticalScale(2),
	},
	topInputsContainer: {
		paddingHorizontal: scale(theme.spacing.md),
		gap: verticalScale(theme.spacing.sm),
		marginBottom: verticalScale(theme.spacing.sm),
	},
	inputContainer: {
		marginBottom: verticalScale(theme.spacing.sm),
	},
	label: {
		fontFamily: theme.typography.semibold,
		fontSize: normalizeFont(isTablet() ? 13 : theme.typography.sizes.xs),
		color: theme.colors.text,
		marginBottom: verticalScale(theme.spacing.xs),
	},
	input: {
		borderWidth: 1,
		borderColor: '#EAEAEA',
		borderRadius: moderateScale(theme.radii.sm),
		paddingVertical: verticalScale(theme.spacing.sm),
		paddingHorizontal: scale(theme.spacing.sm),
		fontSize: normalizeFont(isTablet() ? 14 : theme.typography.sizes.sm),
		color: theme.colors.text,
		fontFamily: theme.typography.regular,
		backgroundColor: theme.colors.surface,
	},
	inputFilled: {
		borderColor: theme.colors.primaryDark,
	},
	inputError: {
		borderColor: theme.colors.error,
	},
	errorText: {
		fontFamily: theme.typography.regular,
		fontSize: normalizeFont(isTablet() ? 12 : theme.typography.sizes.xs),
		color: theme.colors.error,
		marginTop: verticalScale(2),
		marginLeft: scale(theme.spacing.xs),
	},
	section: {
		paddingHorizontal: scale(theme.spacing.md),
		gap: verticalScale(theme.spacing.md),
		marginBottom: verticalScale(theme.spacing.md),
	},
	sectionTitle: {
		fontFamily: theme.typography.semibold,
		fontSize: normalizeFont(isTablet() ? 18 : theme.typography.sizes.md),
		color: theme.colors.title,
	},
	card: {
		backgroundColor: theme.colors.surface,
		borderRadius: moderateScale(theme.radii.md),
		padding: scale(theme.spacing.md),
		...theme.shadows.light,
	},
	instruction: {
		fontSize: normalizeFont(isTablet() ? 13 : theme.typography.sizes.xs),
		color: theme.colors.textLight,
		fontStyle: 'italic',
		marginBottom: verticalScale(2),
		backgroundColor: theme.colors.primaryLight + '10',
		padding: verticalScale(theme.spacing.sm),
		borderRadius: moderateScale(6),
		borderLeftWidth: 3,
		borderLeftColor: theme.colors.primaryDark,
	},
	// Radio styles (used for status)
	radioGroup: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
		gap: scale(theme.spacing.md),
		marginTop: verticalScale(theme.spacing.xs),
	},
	radioButtonContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginRight: scale(theme.spacing.md),
	},
	radioButton: {
		height: moderateScale(16),
		width: moderateScale(16),
		borderRadius: moderateScale(8),
		borderWidth: 2,
		borderColor: '#EAEAEA',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: scale(theme.spacing.xs),
	},
	radioButtonSelected: {
		borderColor: theme.colors.primaryDark,
	},
	radioButtonInner: {
		height: moderateScale(8),
		width: moderateScale(8),
		borderRadius: moderateScale(4),
		backgroundColor: theme.colors.primaryDark,
	},
	radioButtonLabel: {
		fontFamily: theme.typography.medium,
		color: theme.colors.text,
		fontSize: normalizeFont(isTablet() ? 13 : theme.typography.sizes.xs),
	},
	radioError: {
		borderColor: theme.colors.error,
	},
	// condition card styles
	conditionContainer: {
		backgroundColor: theme.colors.surface,
		borderRadius: moderateScale(theme.radii.sm),
		padding: scale(theme.spacing.sm),
		marginBottom: verticalScale(theme.spacing.sm),
		borderWidth: 1,
		borderColor: '#EAEAEA',
	},
	conditionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: verticalScale(theme.spacing.xs),
	},
	conditionTitle: {
		fontFamily: theme.typography.semibold,
		fontSize: normalizeFont(isTablet() ? 15 : theme.typography.sizes.sm),
		color: theme.colors.title,
		flex: 1,
	},

	conditionTitleInput: {
		// small override for editable condition title input
		fontFamily: theme.typography.semibold,
		fontSize: normalizeFont(isTablet() ? 15 : theme.typography.sizes.sm),
		color: theme.colors.title,
		flex: 1,
		padding: 0,
	},

	sectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: verticalScale(theme.spacing.xs),
	},
	editButton: {
		padding: moderateScale(4),
	},
	optionButton: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		backgroundColor: theme.colors.background,
		padding: scale(theme.spacing.sm),
		borderRadius: moderateScale(theme.radii.sm),
		marginBottom: verticalScale(theme.spacing.xs),
		borderWidth: 1,
		borderColor: '#EAEAEA',
	},
	radioCircle: {
		width: moderateScale(20),
		height: moderateScale(20),
		borderRadius: moderateScale(10),
		borderWidth: 2,
		borderColor: '#ccc',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: scale(theme.spacing.sm),
		marginTop: 2,
	},
	radioInner: {
		width: moderateScale(10),
		height: moderateScale(10),
		borderRadius: moderateScale(5),
		backgroundColor: theme.colors.background,
	},
	optionTextContainer: {
		flex: 1,
	},
	optionLabel: {
		fontFamily: theme.typography.medium,
		fontSize: normalizeFont(isTablet() ? 14 : theme.typography.sizes.sm),
		color: theme.colors.text,
		marginBottom: verticalScale(1),
	},
	optionRemark: {
		fontFamily: theme.typography.regular,
		fontSize: normalizeFont(isTablet() ? 13 : theme.typography.sizes.xs),
		color: theme.colors.textLight,
		lineHeight: 18,
	},
	editableRemarkContainer: {
		marginBottom: verticalScale(theme.spacing.xs),
		paddingLeft: scale(theme.spacing.md),
	},
	remarkEditInput: {
		minHeight: verticalScale(80),
		backgroundColor: theme.colors.surface,
	},
	addButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		padding: verticalScale(theme.spacing.sm),
		borderRadius: moderateScale(theme.radii.sm),
		borderWidth: 1,
		borderColor: theme.colors.primaryDark,
		borderStyle: 'dashed',
		marginTop: verticalScale(theme.spacing.xs),
		gap: scale(theme.spacing.xs),
	},
	addButtonText: {
		color: theme.colors.primaryDark,
		fontFamily: theme.typography.semibold,
		fontSize: normalizeFont(theme.typography.sizes.sm),
	},
	subSection: {
		marginTop: verticalScale(theme.spacing.md),
		paddingTop: verticalScale(theme.spacing.sm),
		borderTopWidth: 1,
		borderTopColor: '#EAEAEA',
	},
	subSectionTitle: {
		fontFamily: theme.typography.semibold,
		fontSize: normalizeFont(theme.typography.sizes.md),
		color: theme.colors.title,
		marginBottom: verticalScale(theme.spacing.xs),
	},
	remarkRow: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		marginBottom: verticalScale(theme.spacing.xs),
		gap: scale(theme.spacing.sm),
	},
	remarkInput: {
		flex: 1,
		minHeight: verticalScale(80),
	},
	deleteIcon: {
		paddingTop: verticalScale(theme.spacing.xs),
	},
	permitHolderButtons: {
		flexDirection: 'row',
		gap: scale(theme.spacing.md),
	},
	permitHolderButton: {
		backgroundColor: theme.colors.primaryLight + '10',
		borderColor: theme.colors.primaryDark,
		borderStyle: 'solid',
	},
	permitHolderHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: verticalScale(theme.spacing.xs),
	},
	actionButtons: {
		gap: verticalScale(theme.spacing.sm),
		marginBottom: verticalScale(theme.spacing.lg),
	},
	draftButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: theme.colors.surface,
		padding: verticalScale(theme.spacing.sm),
		borderRadius: moderateScale(theme.radii.sm),
		borderWidth: 1,
		borderColor: '#EAEAEA',
		gap: scale(theme.spacing.xs),
	},
	draftButtonText: {
		color: theme.colors.textLight,
		fontFamily: theme.typography.semibold,
		fontSize: normalizeFont(theme.typography.sizes.sm),
	},
	generateButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: theme.colors.success || '#10b981',
		padding: verticalScale(theme.spacing.sm),
		borderRadius: moderateScale(theme.radii.sm),
		gap: scale(theme.spacing.xs),
	},
	generateButtonText: {
		color: '#fff',
		fontFamily: theme.typography.bold,
		fontSize: normalizeFont(theme.typography.sizes.sm),
	},
		// Legacy / convenience keys used by the screen
		gpsButton: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'center',
			backgroundColor: theme.colors.primaryDark,
			padding: verticalScale(theme.spacing.sm),
			borderRadius: moderateScale(theme.radii.sm),
			marginTop: verticalScale(theme.spacing.xs),
		},
		gpsButtonText: {
			color: '#fff',
			fontFamily: theme.typography.semibold,
			fontSize: normalizeFont(theme.typography.sizes.sm),
		},
		gpsText: {
			fontSize: normalizeFont(theme.typography.sizes.xs),
			color: theme.colors.textLight,
			marginTop: verticalScale(theme.spacing.xs),
			textAlign: 'center',
		},
		statusContainer: {
			flexDirection: 'row',
			gap: scale(theme.spacing.sm),
			marginTop: verticalScale(theme.spacing.xs),
		},
		statusButton: {
			paddingVertical: verticalScale(theme.spacing.sm),
			paddingHorizontal: scale(theme.spacing.sm),
			borderRadius: moderateScale(theme.radii.sm),
			borderWidth: 1,
			borderColor: '#EAEAEA',
			backgroundColor: theme.colors.surface,
		},
		statusButtonActive: {
			backgroundColor: theme.colors.primaryDark,
			borderColor: theme.colors.primaryDark,
		},
		statusButtonText: {
			color: theme.colors.text,
			fontFamily: theme.typography.medium,
		},
		statusButtonTextActive: {
			color: '#fff',
			fontFamily: theme.typography.semibold,
		},
		dateButton: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			backgroundColor: theme.colors.surface,
			borderWidth: 1,
			borderColor: '#EAEAEA',
			borderRadius: moderateScale(theme.radii.sm),
			padding: verticalScale(theme.spacing.sm),
			marginTop: verticalScale(theme.spacing.xs),
		},
		permitSection: {
			marginTop: verticalScale(theme.spacing.md),
		},
		checkboxRow: {
			flexDirection: 'row',
			alignItems: 'center',
			marginVertical: verticalScale(theme.spacing.sm),
		},
		checkbox: {
			flexDirection: 'row',
			alignItems: 'center',
			gap: scale(theme.spacing.xs),
		},
		checkboxBox: {
			width: moderateScale(24),
			height: moderateScale(24),
			borderRadius: moderateScale(4),
			borderWidth: 2,
			borderColor: '#EAEAEA',
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: theme.colors.surface,
		},
		checkboxBoxChecked: {
			backgroundColor: theme.colors.primaryDark,
			borderColor: theme.colors.primaryDark,
		},
		checkboxLabel: {
			fontFamily: theme.typography.semibold,
			color: theme.colors.text,
		},
		permitDetails: {
			marginLeft: scale(theme.spacing.md),
			marginTop: verticalScale(theme.spacing.xs),
		},
});

