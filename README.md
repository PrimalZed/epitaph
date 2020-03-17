# Epitaph

## Saves

export / import file saves

## Architecture

Separate router outlet for navbar title, action button

## Conditions

### Add a Condition

(?) Choose source character

How to represent charges?  Dots?

(?) notice of Condition ending without resolving if charges are spent

## Add Effects

(Add custom Effect; option to save for later)

### Transform Condition

Marionette can turn into a Servant

## P2P

Host device propagates data to connected devices.

## Characters

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

## House Rules

Review / clear house-rule effects added to Haunts
