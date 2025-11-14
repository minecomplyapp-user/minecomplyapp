import { StyleSheet } from 'react-native';
import { theme } from '../../../theme/theme';

export default StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: theme.colors.background || '#F4F7FC',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 30,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primaryLight + "20",
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontFamily: theme.typography.bold,
    color: theme.colors.primaryDark,
  },
  headerInfo: {
    alignItems: 'center',
  },
  userName: {
    fontFamily: theme.typography.bold,
    fontSize: 22,
    color: theme.colors.title,
    marginBottom: 4,
  },
  userRole: {
    fontFamily: theme.typography.regular,
    fontSize: 16,
    color: theme.colors.textLight,
  },
  // NEW Edit Profile Button
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.primaryDark,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: theme.radii.lg,
    marginTop: 16,
  },
  editProfileButtonText: {
    fontFamily: theme.typography.semibold,
    fontSize: 14,
    color: '#fff',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontFamily: theme.typography.bold,
    fontSize: 16,
    color: theme.colors.title,
    marginBottom: 12,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    ...theme.shadows.light,
    overflow: 'hidden',
  },
  cardHeader: {
    padding: 16,
    paddingBottom: 4,
  },
  fieldContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
  },
  fieldLabel: {
    fontFamily: theme.typography.regular,
    fontSize: 12,
    color: theme.colors.textLight,
    marginBottom: 4,
  },
  fieldValue: {
    fontFamily: theme.typography.regular,
    fontSize: 16,
    color: theme.colors.title,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primaryLight + "20",
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuItemText: {
    flex: 1,
    fontFamily: theme.typography.semibold,
    fontSize: 16,
    color: theme.colors.title,
  },
  menuItemRightText: {
    fontFamily: theme.typography.regular,
    fontSize: 14,
    color: theme.colors.textLight,
  },
  divider: {
    height: 1,
    backgroundColor: '#EAEAEA',
    marginHorizontal: 16,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 16,
    backgroundColor: theme.colors.error + '15',
    borderRadius: theme.radii.lg,
  },
  signOutButtonText: {
    fontFamily: theme.typography.bold,
    fontSize: 16,
    color: theme.colors.error,
  },
  footer: {
    padding: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
});