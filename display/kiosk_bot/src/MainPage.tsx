import React from 'react';
import { Carousel } from 'antd';

interface MainPageProps {
  images: string[];
}
const contentStyle: React.CSSProperties = {
    margin:0,
    height: '1000px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
  };
const MainPage: React.FC<MainPageProps> = ({ images }) => {
  return (
    <div>
      <h3>Главная страница</h3>
      {images.length > 0 ? (
        <Carousel arrows infinite={false}>
          {images.map((image, index) => (
            <div key={index}>
              <img src={image} alt={`carousel-${index}`} style={contentStyle} />
            </div>
          ))}
        </Carousel>
      ) : (
        <p>Загрузите изображения для карусели.</p>
      )}
    </div>
  );
};

export default MainPage;
