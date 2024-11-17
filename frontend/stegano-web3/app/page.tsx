import { Metadata } from 'next';
import HomePage from '../components/HomePage';

export const metadata: Metadata = {
  title: 'Steganography App',
  description: 'Hide and reveal secret messages in images',
};

export default function Page() {
  
  return <HomePage/>;
}