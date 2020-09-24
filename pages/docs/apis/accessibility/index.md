---
title: Accessibility
description: Accessibility API
contributors:
  - mlynch
  - jcesarmobile
---

# Accessibility

The Accessibility API makes it easy to know when a user has a screen reader enabled, as well as programmatically speaking
labels through the connected screen reader.

## Example

```typescript
import { Plugins } from '@capacitor/core';

const { Accessibility, Modals } = Plugins;

Accessibility.addListener('accessibilityScreenReaderStateChange', (state) => {
  console.log(state.value);
});

async isVoiceOverEnabled() {
  var vo = await Accessibility.isScreenReaderEnabled();
  alert('Voice over enabled? ' + vo.value);
}

async speak() {
  var value = await Modals.prompt({
    
  });

}
```

## API
