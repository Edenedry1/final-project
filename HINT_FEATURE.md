# Hint Feature for Educational Institutions

## Overview
The hint feature has been added to the DeepFake Audio Detection Game to assist educational institutions in teaching students how to identify fake audio files.

## How it Works

### User Registration
- During sign-up, users can check the "Educational Institution" checkbox
- This sets the `is_institution` flag to `true` in their user profile

### Hint Button Access
- Only users marked as educational institutions can see and use the hint button
- Regular users will see a message: "Hint feature is available for educational institutions only"

### Hint Content by Level

#### Level 1 (Basic Hints)
- Listen for naturalness - fake audio often sounds metallic or robotic
- Pay attention to speech rhythm consistency
- Check audio quality for sharpness and background noise
- Listen to voice tone for natural human qualities

#### Level 2 (Intermediate Hints)
- Listen for breathing patterns
- Pay attention to word connections
- Check emphasis patterns and emotional expression
- Listen to background noise consistency
- Pay attention to voice tone at sentence endings

#### Level 3 (Advanced Hints)
- Listen for voice consistency across the recording
- Pay attention to audio quality across different frequencies
- Check naturalness of pauses
- Listen to voice dynamics and volume variations
- Pay attention to articulation and pronunciation
- Check emotional expression and nuance

## Implementation Details

### Code Structure
- Each level has a `hints` array with different hints for each question
- The hint button appears only when `storedUser?.is_institution` is true
- Hints are displayed using JavaScript `alert()` for simplicity

### Styling
- Hint button has a distinctive orange gradient design
- Hover effects include slight elevation and color change
- Button is centered below the audio files

## Educational Benefits
- Helps teachers guide students in identifying fake audio characteristics
- Provides progressive difficulty with more advanced hints in higher levels
- Encourages critical listening skills development
- Supports classroom learning environments

## Technical Requirements
- User must be logged in
- User account must have `is_institution: true` flag
- Works across all implemented levels (1, 2, and 3) 