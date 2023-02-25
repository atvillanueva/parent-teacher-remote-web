import { MouseEvent, useState, useCallback, useEffect } from "react";
import { useUpdateEffect } from "react-use";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import { xor } from "lodash";

import { getOption } from "../utils";

type ImageButtonProps = {
  selected: boolean;
};

type ImageProps = {
  src: string;
};

type ImageSelectionProps<TOption extends object, TValue = unknown> = {
  value?: TValue[];
  options: TOption[];
  optionValueKey: keyof TOption;
  optionImgSrcKey: keyof TOption;
  onChange?: (value: TValue[]) => void;
};

const ImageButton = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== "selected",
})<ImageButtonProps>(({ theme, selected }) => ({
  position: "relative",
  ...(selected && {
    border: "4px solid",
    borderColor: theme.palette.primary.dark,
  }),
}));

const Image = styled("span", {
  shouldForwardProp: (prop) => prop !== "src",
})<ImageProps>(({ src }) => ({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: "cover",
  backgroundPosition: "center center",
  backgroundImage: `url(${src})`,
}));

function ImageSelection<TOption extends object, TValue = unknown>(
  props: ImageSelectionProps<TOption, TValue>
) {
  const {
    value = [],
    options,
    optionValueKey,
    optionImgSrcKey,
    onChange,
  } = props;

  const [selectedImages, setSelectedImages] = useState<TValue[]>(value);

  const createClickHandler = useCallback(
    (newValue: TValue) => (_event: MouseEvent<HTMLButtonElement>) => {
      setSelectedImages((prevState) => xor(prevState, [newValue]));
    },
    [onChange]
  );

  const getOptionValue = getOption<TOption>(optionValueKey);
  const getOptionImgSrc = getOption<TOption>(optionImgSrcKey);

  useEffect(() => {
    setSelectedImages(value);
  }, [value]);

  useUpdateEffect(() => {
    onChange?.(selectedImages);
  }, [selectedImages]);

  return (
    <Box
      display="grid"
      gridAutoRows="100px"
      gridTemplateColumns="100px 100px 100px"
      gap={0.5}
    >
      {options.map((option) => (
        <ImageButton
          key={getOptionValue(option)}
          selected={value.includes(getOptionValue(option))}
          onClick={createClickHandler(getOptionValue(option))}
        >
          <Image
            src={`${getOptionImgSrc(option)}?w=164&h=164&fit=crop&auto=format`}
          />
        </ImageButton>
      ))}
    </Box>
  );
}

export default ImageSelection;
