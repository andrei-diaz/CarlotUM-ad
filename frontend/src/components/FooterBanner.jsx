import React from 'react';

const FooterBanner = () => {
  return (
    <footer className="w-full bg-gradient-to-r from-primary-500 from-50% to-beige-400 py-10 text-white -mt-32">
      <h1 className="mt-10 text-center text-[15.5vw] font-bold leading-[0.9] tracking-tighter lg:text-[16.6vw]">
        CarlotUM
      </h1>
      <div className="mt-20 flex w-full flex-col items-start gap-5 px-4 font-medium lg:mt-10 lg:flex-row lg:justify-between">
        <div className="flex w-full items-center justify-between gap-12 uppercase lg:w-fit lg:justify-center">
          <p className="w-fit text-sm">
            Universidad Montemorelos <br />
            Nuevo León
          </p>
          <p className="w-fit text-right text-sm lg:text-left">
            Abierto <br /> Todos los días
          </p>
        </div>
        <div className="flex w-full flex-wrap items-center justify-between gap-12 uppercase lg:w-fit lg:justify-center">
          <p className="w-fit text-sm">
            Pedidos <br /> WhatsApp
          </p>
          <p className="w-fit text-right text-sm lg:text-left">
            Entrega Personal <br /> Sin Costo Extra
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterBanner;
