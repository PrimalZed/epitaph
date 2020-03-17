# Epitaph

Epitaph is a bookkeeping application for [Geist: The Sin-Eaters Second Edition](https://www.kickstarter.com/projects/200664283/geist-the-sin-eaters-2nd-edition).

It can be used to track Haunt Conditions, including charges and enhancements, or as a quick reference for Haunts.

The application can be found at https://primalzed.github.io/epitaph.

## TODO

Planned or considered features for future updates.

### Saves

export / import file saves

### Architecture

Separate router outlet for action button

### Conditions

#### Add a Condition

(?) Choose source character

How to represent charges?  Dots?

(?) notice of Condition ending without resolving if charges are spent

### Add Effects

(Add custom Effect; option to save for later)

### P2P

Host device propagates data to connected devices.

### Characters

```typescript
export interface Character {
  id: number;
  name: string;
  player: string;
  haunts: {
    key: string;
    dots: number;
  }[],
  keys: {
    key: string;
    source: string;
  }[]
}
```

Track **Doomed** conditons?

### House Rules

Review / clear house-rule effects added to Haunts
