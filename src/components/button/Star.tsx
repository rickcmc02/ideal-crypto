import { Star } from "@mui/icons-material";
import { IconButton, Popper } from "@mui/material";
import { useEffect, useState } from "react";
import { PALETTE } from "style/palette";

interface StarButtonProps {
  starOn: boolean;
  action: () => void;
}

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
            fill: starOn ? PALETTE.star.on : PALETTE.star.off,
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
          backgroundColor: PALETTE.star.toastBackground,
          border: "1px solid " + PALETTE.borderColor,
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
