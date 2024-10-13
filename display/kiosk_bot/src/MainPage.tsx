import React from "react";
import { Carousel, Image, Layout } from "antd";

interface MainPageProps {
  images: string[];
}

const MainPage: React.FC<MainPageProps> = ({ images }) => {
  return (
    <Layout>
      <Carousel
        autoplay
        style={{ maxWidth: "1000px", margin: "0 auto" }}
        arrows={true}
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
              <Image width={1000} src={image} />
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
