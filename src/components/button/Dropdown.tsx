import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { Button, Menu, MenuItem } from "@mui/material";
import { COIN_MARKET_CONTROLLER } from "models/coin.data";
import { useState } from "react";

interface DropdownButtonProps {
  item: {
    id: string;
    addedLabel?: string;
  };
  selectFunc: (itemValue: string | number) => void;
  label: string;
}

const DropdownButton = ({ item, label, selectFunc }: DropdownButtonProps) => {
  const [dropdownAnchorEl, setDropdownAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const dropdownOpen = Boolean(dropdownAnchorEl);

  const conId = item.id;
  const endIcon =
    conId === dropdownAnchorEl?.id ? (
      <KeyboardArrowUp />
    ) : (
      <KeyboardArrowDown />
    );

  const handleSelectListButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setDropdownAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setDropdownAnchorEl(null);
  };

  const selectDropdown = (itemValue: string | number) => {
    selectFunc(itemValue);
    handleDropdownClose();
  };

  return (
    <>
      <Button
        key={item.id}
        id={item.id}
        aria-label={`select-${item.id}`}
        endIcon={endIcon}
        sx={{ color: "black" }}
        onClick={handleSelectListButtonClick}
      >
        {label}
      </Button>
      <Menu
        anchorEl={dropdownAnchorEl}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={dropdownOpen}
        onClose={handleDropdownClose}
      >
        {dropdownAnchorEl &&
          COIN_MARKET_CONTROLLER[
            dropdownAnchorEl.id as keyof typeof COIN_MARKET_CONTROLLER
          ].items.map((item) => (
            <MenuItem
              key={`${dropdownAnchorEl.id}_${item.value}`}
              onClick={() => selectDropdown(item.value)}
            >
              {item.label}
            </MenuItem>
          ))}
      </Menu>
    </>
  );
};

export default DropdownButton;
