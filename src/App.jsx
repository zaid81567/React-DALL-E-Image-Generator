import { useState } from "react";
import Modal from "./components/Modal";

function App() {
  const [images, setImages] = useState(null);
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modelOpen, setModalOpen] = useState(false);
  const surpriseOptions = [
    "A rocket with contrails in a blue cloudless sky",
    "A black car parked in a cave, cartoonic painting",
    "Bunch of blue bananas in a yellow bowl",
    "An apple cut in two halves but it's orange inside",
    "A pineapple growing on a beach",
  ];

  const getImages = async () => {
    setImages(null);
    if (value === null || value === "") {
      setError("Error! Must enter a search term");
      return;
    }
    setError(null);
    console.log("inside app's func getImages");
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          message: value,
        }),
        headers: {
          "content-type": "application/json",
        },
      };
      const response = await fetch("http://localhost:8000/images", options);
      const data = await response.json();
      console.log(data);
      setImages(data);
    } catch (error) {
      console.error(error);
    }
  };

  const surpriseMe = () => {
    const surpriseMe_value =
      surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(surpriseMe_value);
  };

  const uploadImage = async (e) => {
    console.log(e.target.files[0]);

    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    setModalOpen(true);
    setSelectedImage(e.target.files[0]);
    e.target.value = null;

    try {
      const options = {
        method: "POST",
        body: formData,
      };
      const response = await fetch("http://localhost:8000/upload", options);
      const data = await response.json();
    } catch (error) {
      console.error(error);
    }
  };

  const generateVariations = async () => {
    setImages(null);
    if (selectedImage === null) {
      setError("Error! Must have an existing image");
      setModalOpen(false);
      return;
    }
    try {
      const options = {
        method: "POST",
      };
      const response = await fetch("http://localhost:8000/variations", options);
      const data = await response.json();
      console.log(data);
      setImages(data);
      setError(null);
      setModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="app">
      <section className="top-section">
        <section className="search-section">
          <header>
            <p>
              Start with a detailed discription{" "}
              <span className="surprise" onClick={surpriseMe}>
                Surprise me
              </span>{" "}
            </p>
            <h2 className="site-name">PixelWaves</h2>
          </header>

          <div className="input-container">
            <input
              value={value}
              type="text"
              placeholder="A brown wolf person in a coat, painting ..."
              onChange={(e) => setValue(e.target.value)}
            />
            <button onClick={getImages}>Generate</button>
          </div>

          <p className="extra-info">
            Or,
            <span>
              <label className="image-upload" htmlFor="files">
                upload an image{" "}
              </label>
              <input
                onChange={uploadImage}
                type="file"
                id="files"
                accept="image/*"
                hidden
              />
            </span>
            to edit.
          </p>
          {error && <p>{error}</p>}
          {modelOpen && (
            <div className="overlay">
              <Modal
                setModalOpen={setModalOpen}
                setSelectedImage={setSelectedImage}
                selectedImage={selectedImage}
                generateVariations={generateVariations}
              />
            </div>
          )}
        </section>
      </section>

      <section className="image-section">
        {images?.map((image, _index) => (
          <img
            key={_index}
            src={image.url}
            alt={`AI Generated Image of ${value}`}
          />
        ))}
      </section>
    </div>
  );
}

export default App;
