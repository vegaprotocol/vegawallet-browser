import { Icon } from "@vegaprotocol/ui-toolkit";
import { VegaIcon } from "../icons/vega-icon";
import { HostImage } from "../host-image";

export const ModalHeader = ({
  hostname,
  title,
}: {
  hostname: string;
  title: string;
}) => {
  return (
    <>
      <div className="flex justify-center mt-16">
        <HostImage hostname={hostname} />
        <div className="flex flex-col justify-center mx-8">
          <Icon name="arrow-right" className="text-vega-yellow-500" />
        </div>
        <VegaIcon inverted={true} />
      </div>
      <div className="text-center mb-6 mt-10">
        <h1 className="mb-1 text-2xl">{title}</h1>
        <p data-testid="dapp-hostname" className="text-neutral-light">
          {hostname}
        </p>
      </div>
    </>
  );
};
