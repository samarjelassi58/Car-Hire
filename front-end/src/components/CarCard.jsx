import { Card, CardHeader, CardBody, CardFooter, Typography, Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { imageUrl } from "../app/utils/api";

const CarCard = ({ car }) => {
  const navigate = useNavigate();
  const { _id, name, pricePerDay, image, options = [], category, fuelType } = car;
  const subtitle = [category, fuelType].filter(Boolean).join(" · ");

  return (
    <Card
      className="mt-6 w-96 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onClick={() => navigate(`/car/${_id}`)}
    >
      <CardHeader color="blue-gray" className="relative h-72">
        <img src={imageUrl(image)} alt={name} className="w-full h-full object-cover" />
        <div className="absolute top-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {pricePerDay} TND/jour
        </div>
      </CardHeader>
      <CardBody>
        <Typography variant="h5" color="blue-gray" className="mb-2">
          {name}
        </Typography>
        {subtitle && <Typography className="mb-3 text-gray-700">{subtitle}</Typography>}
        <div className="flex flex-wrap gap-2">
          {options.map((option) => (
            <span key={option} className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md text-sm">
              {option}
            </span>
          ))}
        </div>
      </CardBody>
      <CardFooter className="pt-0">
        <Button
          className="bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300"
          fullWidth
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/reservation/${_id}`);
          }}
        >
          Réserver
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CarCard;
