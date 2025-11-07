import Button from "./ui/Button";
import HandIcon from "../icons/HandIcon";
import SelectionIcon from "../icons/SelectionIcon";
import SquareIcon from "../icons/SquareIcon";
import DiamondIcon from "../icons/DiamondIcon";
import CircleIcon from "../icons/CircleIcon";
import ArrowIcon from "../icons/ArrowIcon";
import LineIcon from "../icons/LineIcon";
import PencilIcon from "../icons/PencilIcon";
import ImageIcon from "../icons/ImageIcon";
import EraserIcon from "../icons/EraserIcon";

const Toolbar = () => {
  return (
    <div className="inline-flex justify-between h-auto bg-light dark:bg-dark border border-gray-200 rounded-xl shadow-sm transition-all duration-300">
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
