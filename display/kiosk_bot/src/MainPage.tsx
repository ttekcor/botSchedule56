import React, { useEffect, useState } from "react";
import { Carousel, Image, Layout, message } from "antd";
import axios from "axios";

const MainPage: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/photos");
        setImages(response.data); // Сохраняем URL изображений из API
        console.log("Загруженные изображения:", response.data);
      } catch (error) {
        message.error("Ошибка при загрузке фотографий");
        console.error("Ошибка запроса фотографий:", error);
      }
    };

    fetchPhotos();
  }, []);

  return (
    <Layout>
      <Carousel
        autoplay
        style={{
          width: "1000px",
          height: "1000px",
          margin: "0",
          position: "relative",
          lineHeight: "100px",
        }}
        arrows
        dots={true} // Убираем стандартные точки
      >
        {images.length > 0 ? (
          images.map((image, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                width={1000}
                src={image} // Используем полный URL, полученный из API
                alt={`Image ${index}`}
                style={{
                  objectFit: "cover", // Растягиваем изображение равномерно
                  borderRadius: "8px", // Добавляем скругление
                }}
              />
            </div>
          ))
        ) : (
          <div>
            <h3>Нет изображений для отображения</h3>
          </div>
        )}
      </Carousel>
    </Layout>
  );
};

export default MainPage;
