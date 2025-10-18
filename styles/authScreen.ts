import { StyleSheet } from 'react-native';
import { theme } from '../theme/theme';
import { scale, verticalScale, moderateScale, isTablet } from '../utils/responsive';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(60),
    paddingBottom: verticalScale(40),
  },

  // HEADER
  header: {
    marginBottom: verticalScale(40),
    alignItems: 'flex-start',
  },
  logo: {
    width: isTablet() ? scale(100) : scale(80),
    height: isTablet() ? scale(100) : scale(80),
    marginBottom: verticalScale(16),
    resizeMode: 'contain',
  },
  title: {
    fontSize: moderateScale(28),
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: verticalScale(6),
  },
  subtitle: {
    fontSize: moderateScale(15),
    color: '#6b7280',
    lineHeight: verticalScale(22),
  },

  // FORM
  formContainer: {
    marginBottom: verticalScale(32),
  },
  inputContainer: {
    marginBottom: verticalScale(20),
    position: 'relative',
    paddingTop: verticalScale(12),
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: moderateScale(12),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(14),
    fontSize: moderateScale(16),
    color: '#1a1a1a',
    backgroundColor: '#ffffff',
  },
  inputFocused: {
    borderColor: theme.colors.primaryDark,
    borderWidth: 2,
  },
  labelBase: {
    position: 'absolute',
    backgroundColor: '#F5F6F4',
    paddingHorizontal: scale(4),
    left: scale(16),
  },

  // BUTTON
  button: {
    backgroundColor: theme.colors.primaryDark,
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(8),
    shadowColor: theme.colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: moderateScale(17),
    fontWeight: '600',
  },

  // Forgot password link
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -verticalScale(8),
    marginBottom: verticalScale(24),
  },
  linkText: {
    color: theme.colors.primaryDark,
    fontWeight: '600',
  },

  // Agreement text
  agreementContainer: {
    marginTop: verticalScale(8),
    marginBottom: verticalScale(24),
    alignItems: 'center',
    justifyContent: 'center',
  },
  agreementText: {
    fontSize: moderateScale(13),
    color: '#6b7280',
    lineHeight: verticalScale(18),
    textAlign: 'center',
    maxWidth: '90%',
  },

  // BOTTOM SECTION
  bottomSection: {
    marginTop: 'auto',
    paddingTop: verticalScale(24),
  },
  switchButton: {
    alignItems: 'center',
    paddingVertical: verticalScale(8),
  },
  switchText: {
    fontSize: moderateScale(15),
    color: '#6b7280',
  },
  switchTextBold: {
    color: theme.colors.primaryDark,
    fontWeight: '700',
  },
});
