const fileInput = document.querySelector(".input-file");
const chooseImg = document.querySelector(".choose");
const previewImg = document.querySelector(".preview-img img");
const filterOptn = document.querySelectorAll(".filter button");
const filterName = document.querySelector(".filter-info .name");
const filterValue = document.querySelector(".filter-info .value");
const filterSlider = document.querySelector(".slider input");
const rotateOptn = document.querySelectorAll(".rotate button");

const resetAll = document.querySelector(".reset");
const saveImg = document.querySelector(".save");

let brightness = 100,
  saturation = 100,
  inversion = 0,
  grayscale = 0;

let rotate = 0,
  flipH = 1,
  flipV = 1;

const applyFilter = () => {
  previewImg.style.filter = `brightness(${brightness}%) 
        saturate(${saturation}%) invert(${inversion}%) 
        grayscale(${grayscale}%)`;

  previewImg.style.transform = `rotate(${rotate}deg) scale(${flipH}, ${flipV})`;
};


const newImage = () => {
    let file = fileInput.files[0];
    if (!file) return;
    previewImg.src = URL.createObjectURL(file);
    previewImg.addEventListener("load", () => {
        resetAll.click();
        document.querySelector(".container").classList.remove("disable");
    });
};

// only clicked button is active
filterOptn.forEach(option => {
    option.addEventListener("click", () => {
        document.querySelector(".filter .active").classList.remove("active");
        option.classList.add("active");

        filterName.innerText = option.innerText;

        if (option.id === "brightness") {
            filterSlider.max = "200";
            filterSlider.value = brightness;
            filterValue.innerText = `${brightness}%`;
        } else if (option.id === "saturation") {
            filterSlider.max = "200";
            filterSlider.value = saturation;
            filterValue.innerText = `${saturation}%`;
        } else if (option.id === "inversion") {
            filterSlider.max = "100";
            filterSlider.value = inversion;
            filterValue.innerText = `${inversion}%`;
        } else {
            filterSlider.max = "100";
            filterSlider.value = grayscale;
            filterValue.innerText = `${grayscale}%`;
        }
    });
});

const updateFilter = () => {
    filterValue.innerText = `${filterSlider.value}%`;
    const selectedFilter = document.querySelector(".filter .active");

    if (selectedFilter.id === "brightness") {
        brightness = filterSlider.value;
    } else if (selectedFilter.id === "saturation") {
        saturation = filterSlider.value;
    } else if (selectedFilter.id === "inversion") {
        inversion = filterSlider.value;
    } else {
        grayscale = filterSlider.value;
    }
    applyFilter();
};

rotateOptn.forEach(option => {
    option.addEventListener("click", () => {
        if (option.id === "left") {
            rotate -= 90;
        } else if (option.id === "right") {
            rotate += 90;
        } else if (option.id === "horizontal") {
            flipH = flipH === 1 ? -1 : 1;
        } else {
            flipV = flipV === 1 ? -1 : 1;
        }
        applyFilter();
    });
});

const resetFilter = () => {
    brightness = 100, saturation = 100, inversion = 0, grayscale = 0;
    rotate = 0, flipH = 1, flipV = 1;
    filterOptn[0].click();
    applyFilter();
};

const saveImage = () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;
    context.filter = `brightness(${brightness}%) 
    saturate(${saturation}%) invert(${inversion}%) 
    grayscale(${grayscale}%)`;
    context.translate(canvas.width / 2, canvas.height / 2);
    if (rotate != 0) {
        context.rotate(rotate * Math.PI / 180);
    }
    context.scale(flipH, flipV);
    context.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    const link = document.createElement("a");
    link.download = "image.jpg";
    link.href = canvas.toDataURL();
    link.click();
};

fileInput.addEventListener('change', newImage);
filterSlider.addEventListener("input", updateFilter);
resetAll.addEventListener('click', resetFilter);
saveImg.addEventListener('click', saveImage);
chooseImg.addEventListener('click', () => fileInput.click());