import { ImageResponse } from 'next/server';

export const size = { width: 32, height: 32 };
export const content = 'image/svg+xml';

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 20,
        background: '#4F46E5',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        borderRadius: 4,
      }}
    >
      Y
    </div>
  );
}
