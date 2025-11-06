import ArrowIcon from "../icons/ArrowIcon";
import CircleIcon from "../icons/CircleIcon";
import DiamondIcon from "../icons/DiamondIcon";
import EraserIcon from "../icons/EraserIcon";
import HandIcon from "../icons/HandIcon";
import ImageIcon from "../icons/ImageIcon";
import LineIcon from "../icons/LineIcon";
import PencilIcon from "../icons/PencilIcon";
import SelectionIcon from "../icons/SelectionIcon";
import SquareIcon from "../icons/SquareIcon";
import Button from "./ui/Button";

const Toolbar = () => {
  return (
    <div className="flex justify-between h-auto w-[40vw] bg-light dark:bg-dark border border-gray-200 rounded-xl shadow-sm">
      <Button variant="ghost" size="md" icon={<HandIcon />} />
      <Button variant="ghost" size="md" icon={<SelectionIcon />} />
      <Button variant="ghost" size="md" icon={<SquareIcon />} />
      <Button variant="ghost" size="md" icon={<DiamondIcon />} />
      <Button variant="ghost" size="md" icon={<CircleIcon />} />
      <Button variant="ghost" size="md" icon={<ArrowIcon />} />
      <Button variant="ghost" size="md" icon={<LineIcon />} />
      <Button variant="ghost" size="md" icon={<PencilIcon />} />
      <Button variant="ghost" size="md" text="A" />
      <Button variant="ghost" size="md" icon={<ImageIcon />} />
      <Button variant="ghost" size="md" icon={<EraserIcon />} />
    </div>
  );
};

export default Toolbar;
