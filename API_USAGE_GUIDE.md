# API Usage Guide - Limited Key Management

## 🔑 Setting Up Your New API Key

1. **Update API Key**: Replace `"YOUR_NEW_API_KEY_HERE"` in `src/services/api.ts` line 21
2. **Or use the helper function**: Call `updateApiKey("your-new-key")` from anywhere in the app

## ⚙️ API Configuration Settings

Located in `src/services/api.ts` (lines 4-16):

```typescript
// Set to false to use only mock data (no API calls)
const ENABLE_API_CALLS = true;

// Set to true to prefer mock data over API when available
const PREFER_MOCK_DATA = true;

// Minimum characters before making API calls (higher = fewer calls)
const MIN_SEARCH_LENGTH = 3;
```

## 🛡️ API Call Optimization Features

### 1. **Smart Caching (10 minutes)**

- All airport searches are cached for 10 minutes
- Repeated searches use cached data instead of API calls

### 2. **Extended Mock Airport Database**

- 12 major airports available offline
- Covers major cities: Karachi, Lahore, Dubai, London, Paris, New York, etc.
- API only called when mock data doesn't match

### 3. **Debounced Search (500ms)**

- Users must stop typing for 500ms before API call
- Prevents excessive calls during typing

### 4. **Minimum Query Length (3 characters)**

- No API calls for queries shorter than 3 characters
- Reduces unnecessary calls for partial inputs

### 5. **Graceful Fallbacks**

- Always falls back to mock data if API fails
- App continues working even with quota exceeded

## 📊 Expected API Usage

**Airport Search API Calls:**

- Real usage: ~2-5 calls per user session (thanks to caching & mock preference)
- Without optimization: ~20-50 calls per session

**Flight Search API Calls:**

- 1 call per actual flight search submitted
- Only called when user clicks "Search" button

## 🎛️ Emergency API Conservation

If you need to preserve API calls further:

### Option 1: Use Only Mock Data

```typescript
const ENABLE_API_CALLS = false; // In api.ts line 5
```

### Option 2: Increase Minimum Search Length

```typescript
const MIN_SEARCH_LENGTH = 4; // Require 4+ characters
```

### Option 3: Extend Debounce Delay

```typescript
// In LocationInputs.tsx lines 75 & 85
}, 1000); // Change from 500ms to 1000ms
```

## 🔍 Monitoring API Usage

Check browser console for these messages:

- `✅ Returning cached airport results` - Using cache (no API call)
- `📝 Using preferred mock data` - Using mock data (no API call)
- `🌐 Making API call for airport search` - **Using API call**
- `❌ Error searching airports via API` - API failed/quota exceeded

## 📋 Available Mock Airports

Your app works offline with these airports:

- **Pakistan**: KHI (Karachi), LHE (Lahore), ISB (Islamabad)
- **Middle East**: DXB (Dubai)
- **Europe**: LHR (London), CDG (Paris)
- **Asia**: SIN (Singapore), NRT (Tokyo), ICN (Seoul)
- **USA**: JFK (New York), LAX (Los Angeles), ORD (Chicago)

## ✅ Verification Checklist

- [ ] Updated API key in `src/services/api.ts`
- [ ] Tested airport search with mock data
- [ ] Confirmed debouncing works (type quickly, wait 500ms)
- [ ] Verified caching (search same term twice)
- [ ] Tested flight search functionality

## 🚨 Troubleshooting

**If quota exceeded:**

1. Set `ENABLE_API_CALLS = false` temporarily
2. App will work with mock airports only
3. Flight search will show error but won't crash

**To check configuration:**

- Look for console messages indicating mock vs API usage
- Higher percentage of mock usage = better quota preservation
