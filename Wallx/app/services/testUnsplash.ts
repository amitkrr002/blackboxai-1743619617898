import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import { getRandomPhotos } from './unsplash';

async function testUnsplashAPI() {
  try {
    console.log('Testing Unsplash API...');
    const photos = await getRandomPhotos(1);
    console.log('API Response:', photos);
    if (photos.length > 0 && photos[0].imageUrl) {
      console.log('✅ Unsplash API is working correctly');
    } else {
      console.log('⚠️ API returned empty response');
    }
  } catch (error) {
    console.error('❌ Unsplash API Error:', error);
  }
}

testUnsplashAPI();