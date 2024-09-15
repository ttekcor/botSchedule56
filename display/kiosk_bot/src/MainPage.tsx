import React from 'react';
import { Carousel, Layout } from 'antd';

interface MainPageProps {
  images: string[];
}

const MainPage: React.FC<MainPageProps> = ({ images }) => {
  return <Layout style={{
    minHeight: '100vh',
    backgroundImage: "url('botSchedule56/display/kiosk_bot/public/OF18H90.jpg')",
    backgroundSize: 'auto', // Оставляем реальный размер рисунка
    backgroundPosition: 'center',
    backgroundRepeat: 'repeat', // Повторяем изображение для создания паттерна
  }}>
    
    <h2>Добро пожаловать на главную страницу</h2>

    <Carousel autoplay style={{ maxWidth: '1000px', margin: '0 auto' }} arrows={true}>
      {images.length > 0 ? (
        images.map((image, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img
              src={image}
              alt={`Slide ${index}`}
              style={{
                width: '100%', // Задаем ширину изображения
                maxHeight: '1900px', // Ограничиваем максимальную высоту
                objectFit: 'contain', // Изображение адаптируется по размеру
                margin: '0 auto',
              }} />
          </div>
        ))
      ) : (
        <div>
          <h3>Нет изображений для отображения</h3>
        </div>
      )}
    </Carousel>
 
  </Layout>;

};

export default MainPage;
