import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
 
const CarCard = ({ car }) => {
  const navigate = useNavigate();
  
  const {
    id,
    name = "Toyota Corolla",
    price = "75 TND/day",
    image = "https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    features = ["5 Seats", "Manual", "AC", "GPS"],
    description = "Perfect for city driving and short trips. Economical and reliable vehicle."
  } = car || {};

  const handleCardClick = () => {
    navigate(`/car/${id}`);
  };

  return (
    <Card 
      className="mt-6 w-96 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      <CardHeader color="blue-gray" className="relative h-72">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {price}
        </div>
      </CardHeader>
      <CardBody>
        <Typography variant="h5" color="blue-gray" className="mb-2">
          {name}
        </Typography>
        <Typography className="mb-3 text-gray-700">
          {description}
        </Typography>
        <div className="flex flex-wrap gap-2">
          {features.map((feature, index) => (
            <span 
              key={index}
              className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md text-sm"
            >
              {feature}
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
            navigate(`/reservation/${id}`);
          }}
        >
          Reserve Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CarCard;

