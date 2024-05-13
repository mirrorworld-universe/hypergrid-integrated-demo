export function BorderAngular() {
  return (
    <>
      <img className="border_angular angular1" src="/images/border_angular1.png" alt="" />
      <img className="border_angular angular2" src="/images/border_angular2.png" alt="" />
      <img className="border_angular angular3" src="/images/border_angular3.png" alt="" />
      <img className="border_angular angular4" src="/images/border_angular4.png" alt="" />
    </>
  );
}

import { usePageContext } from '../context';

export function NetworkRequire() {
  const { Devnet, HyperGrid, Custom, endpoint } = usePageContext();
  if (endpoint === Devnet.value || endpoint === HyperGrid.value) {
    return <>{HyperGrid.label}</>;
  } else {
    return <>{Custom.value}</>;
  }
}
