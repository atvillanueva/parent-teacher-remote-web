import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import Form from "./components/form";

const images = [
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
    title: "Breakfast",
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
    title: "Burger",
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
    title: "Camera",
  },
  {
    id: 4,
    img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
    title: "Coffee",
  },
  {
    id: 5,
    img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
    title: "Hats",
  },
  {
    id: 6,
    img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
    title: "Honey",
  },
];

const schema = z.object({
  homeRoomName: z.string().min(1),
  studentNumber: z.string().min(1),
  nounIds: z.array(z.number()).min(2),
});

function App() {
  const formMethods = useForm<z.infer<typeof schema>>({
    defaultValues: {
      homeRoomName: "",
      studentNumber: "",
      nounIds: [],
    },
    mode: "all",
    resolver: zodResolver(schema),
  });

  const handleSubmit = (values: z.infer<typeof schema>) => {
    console.log(values);
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, mt: 0, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Form {...formMethods} onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <Form.Input label="Home Room" name="homeRoomName" />
                <Form.Input label="Student Number" name="studentNumber" />
                <Form.ImageSelection
                  name="nounIds"
                  options={images}
                  optionValueKey="id"
                  optionImgSrcKey="img"
                />
                <Button type="submit" fullWidth sx={{ mt: 3, mb: 2 }}>
                  Sign In
                </Button>
              </Stack>
            </Form>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default App;
