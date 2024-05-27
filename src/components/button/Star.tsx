import { Star } from "@mui/icons-material";
import { IconButton, Popover, Popper } from "@mui/material";
import { useEffect, useState } from "react";

interface StarButtonProps {
  starOn: boolean;
  action: () => void;
}

const color = {
  toastBackground: "#bdcce8",
  starOn: "#ebb23e",
  starOff: "#c4c4c4",
};

const StarButton = ({ starOn, action }: StarButtonProps) => {
  const [toastAnchor, setToastAnchor] = useState<null | HTMLElement>(null);

  useEffect(() => {
    if (toastAnchor) {
      setTimeout(() => {
        setToastAnchor(null);
      }, 1000);
    }
  }, [toastAnchor]);

  return (
    <>
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          action();
          setToastAnchor(e.currentTarget);
        }}
      >
        <Star
          sx={{
            fill: starOn ? color.starOn : color.starOff,
          }}
        />
      </IconButton>
      <Popper
        anchorEl={toastAnchor}
        open={Boolean(toastAnchor)}
        placement="bottom-start"
        sx={{
          px: 1.5,
          py: 1,
          backgroundColor: color.toastBackground,
          border: "1px solid lightgray",
          borderRadius: "4px",
          fontWeight: 700,
          fontSize: "0.8rem",
        }}
      >
        {starOn ? "북마크가 추가되었습니다." : "북마크가 해제되었습니다."}
      </Popper>
    </>
  );
};

export default StarButton;
