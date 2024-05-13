import { useState, useEffect } from 'react';

export default function VantaDots() {
  useEffect(() => {
    const initializeVanta = () => {
      const _window = window as any;
      if (_window.VANTA) {
        // console.log('_window.VANTA', _window.VANTA);
        _window.VANTA.DOTS({
          el: '.s-section',
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200,
          minWidth: 200,
          scale: 1,
          scaleMobile: 1,
          color: 0x2828b2,
          backgroundColor: 0x1b1c1d,
          size: 3,
          spacing: 20,
          showLines: false
        });
      }
    };

    const subscribeToEvent = () => {
      const _window = window as any;
      if (_window.edit_page && _window.edit_page.Event) {
        _window.edit_page.Event.subscribe('Page.beforeNewOneFadeIn', initializeVanta);
      }
    };

    initializeVanta();
    subscribeToEvent();
  }, []);
  return <div className="s-section"></div>;
}
