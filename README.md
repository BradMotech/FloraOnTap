build eas
eas build -p android --profile preview

check updates
npx npm-check-updates -u

then update
ncu -u

 First I ran npx expo-doctor then it told me to:

Fix Package dependencies issues.
Field: Android.adaptiveIcon.foregroundImage - image should be square, but the file at './assets/logo.png' has dimensions 150x148.
Field: icon - image should be square, but the file at './assets/logo.png' has dimensions 150x148.
So I fixed all these. and then again ran npx expo-doctor and it was then fixed.