# LiverCare AI - Onboarding Flow

## New User Journey

### 1. Sign Up
- User creates account on homepage with email, password, and full name
- Account is created in localStorage (simulated backend)
- User is automatically signed in

### 2. Auto-Redirect to Data Collection
- Dashboard layout detects `patientProfile?.isOnboardingComplete` is undefined/false
- User is automatically redirected to `/dashboard/data-collection`
- Onboarding banner appears: "Onboarding Required: Please complete your health profile to unlock the dashboard."

### 3. Health Profile Collection
The data collection page collects:
- **Demographics**: Age, Gender, Alcohol Consumption, Family History
- **Medical History**: Medical conditions, Allergies, Current Medications
- **Risk Factors**: Specific health risk factors

Once user clicks "Save", the profile is stored and `isOnboardingComplete` is set to `true`.

### 4. Dashboard Access
- After onboarding completes, user can access all dashboard features:
  - Health Metrics Cards showing liver disease indicators
  - Charts tracking health trends
  - Real-time health alerts
  - AI-powered health analysis
  - Doctor appointment booking
  - Community features

## Returning User Flow

1. User signs in
2. If `patientProfile?.isOnboardingComplete === true`, they go straight to dashboard
3. If not complete, they're redirected to data collection

## Key Features Unlocked After Onboarding

✅ Dashboard with health metrics visualization
✅ Liver disease risk assessment
✅ Doctor appointment booking
✅ Health trend analysis
✅ AI-powered health insights
✅ Community support and recommendations

## Menu Items (After Onboarding)

In the dropdown menu users can:
- Book Doctor appointments
- Update health profile
- View profile information
- Access community features
- Adjust settings
- Sign out
