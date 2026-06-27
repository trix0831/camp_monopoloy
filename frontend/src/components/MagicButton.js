import React, { useState, useRef, useEffect } from "react";
import { Button } from "@mui/material";
import MagicSpinner from "./MagicSpinner";

/**
 * MagicButton — a drop-in replacement for MUI <Button> for actions that
 * fire a network request (deposit, transfer, broadcast, sell, …).
 *
 * While the async `onClick` is in flight it swaps its label for a
 * Harry-Potter "casting a spell" spinner and disables itself, giving the
 * user clear feedback during the request lag.
 *
 * Pass an async (or promise-returning) `onClick`; the button stays in its
 * loading state until that promise settles. All other props (variant, sx,
 * fullWidth, disabled, …) pass straight through to the underlying Button.
 */
const MagicButton = ({ onClick, children, disabled, ...props }) => {
  const [loading, setLoading] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleClick = async (event) => {
    if (loading || !onClick) return;
    setLoading(true);
    try {
      // Works whether onClick is sync or returns a promise.
      await onClick(event);
    } finally {
      // The handler may navigate away and unmount us — guard the update.
      if (mountedRef.current) setLoading(false);
    }
  };

  return (
    <Button {...props} disabled={disabled || loading} onClick={handleClick}>
      {loading ? <MagicSpinner /> : children}
    </Button>
  );
};

export default MagicButton;
