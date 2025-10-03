# Property Images Setup Guide

This guide explains how to set up property images for your HomeKey platform.

## Current Implementation

The system uses **Unsplash API** for demo purposes, providing high-quality real estate photos. For production, you'll want to integrate with real estate data sources.

## Setup Options

### Option 1: Unsplash API (Current - Demo)

1. **Get Unsplash API Key**:

   - Go to [Unsplash Developers](https://unsplash.com/developers)
   - Create a new application
   - Copy your Access Key

2. **Add to Environment Variables**:

   ```env
   UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
   ```

3. **Benefits**:
   - ✅ High-quality real estate photos
   - ✅ Free for demo/development
   - ✅ Consistent image selection per property
   - ✅ Fallback images included

### Option 2: Real Estate APIs (Production)

#### MLS Integration

```typescript
// Example MLS API integration
const mlsImages = await fetchMLSPropertyImages(mlsNumber);
```

#### Zillow API (Limited)

```typescript
// Note: Zillow API access is very limited
const zillowImages = await fetchZillowImages(propertyId);
```

#### Realtor.com API

```typescript
// Requires partnership agreement
const realtorImages = await fetchRealtorImages(propertyId);
```

### Option 3: Web Scraping (Legal Considerations)

```typescript
// Example: Scrape public property photos
const scrapedImages = await scrapePropertyImages(propertyUrl);
```

**Important**: Always respect `robots.txt` and terms of service.

## Image Service Features

### Current Implementation

```typescript
// Get single property image
const imageUrl = await ImageService.getPropertyImage(propertyId, "exterior");

// Get multiple images
const images = await ImageService.getMultiplePropertyImages(propertyId, 3);

// Get placeholder image
const placeholder = ImageService.getPlaceholderImage(400, 300, "Property");
```

### API Endpoints

- `GET /api/properties/[id]/images` - Get property images
- `GET /api/properties/[id]/images?type=interior` - Get interior images
- `GET /api/properties/[id]/images?count=3` - Get multiple images

### Component Usage

```tsx
import { PropertyImage } from "@/components/PropertyImage";

<PropertyImage
  propertyId="prop_001"
  type="exterior"
  alt="Property image"
  className="w-full h-48"
  width={400}
  height={192}
/>;
```

## Image Caching

The system includes intelligent caching:

- **Memory cache** for API responses
- **Consistent image selection** per property ID
- **Fallback images** for failed requests

## Production Recommendations

### 1. Database Storage

```sql
-- Store image URLs in database
ALTER TABLE properties ADD COLUMN image_urls JSONB;
ALTER TABLE property_images ADD COLUMN image_url TEXT;
```

### 2. CDN Integration

```typescript
// Use CDN for image delivery
const cdnUrl = `https://cdn.homekey.com/images/${propertyId}/${imageType}.jpg`;
```

### 3. Image Optimization

```typescript
// Implement image optimization
const optimizedUrl = optimizeImage(originalUrl, { width: 400, quality: 80 });
```

### 4. Real Estate Data Sources

#### Priority Order:

1. **MLS APIs** - Most comprehensive
2. **County Records** - Public property photos
3. **Real Estate Platforms** - Zillow, Realtor.com
4. **User Uploads** - Crowdsourced photos
5. **Stock Images** - Fallback option

## Testing

### Test Image API

```bash
# Test single image
curl http://localhost:3000/api/properties/prop_001/images

# Test multiple images
curl http://localhost:3000/api/properties/prop_001/images?count=3

# Test interior images
curl http://localhost:3000/api/properties/prop_001/images?type=interior
```

### Expected Response

```json
{
  "imageUrl": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop"
}
```

## Troubleshooting

### Common Issues

1. **No Images Loading**

   - Check Unsplash API key
   - Verify network connectivity
   - Check browser console for errors

2. **Slow Image Loading**

   - Implement image preloading
   - Use CDN for delivery
   - Optimize image sizes

3. **Inconsistent Images**
   - Clear image cache
   - Check property ID consistency
   - Verify API response

### Debug Mode

```typescript
// Enable debug logging
console.log("Fetching image for property:", propertyId);
console.log("Image URL:", imageUrl);
```

## Next Steps

1. **Set up Unsplash API key** for demo
2. **Test image loading** on properties page
3. **Plan production image strategy**
4. **Implement image optimization**
5. **Set up CDN for production**

## Cost Considerations

- **Unsplash**: Free for demo, paid for commercial use
- **MLS APIs**: $200-500/month per region
- **CDN**: $0.10-0.50 per GB
- **Storage**: $0.02-0.10 per GB/month

Choose the option that best fits your budget and requirements!
