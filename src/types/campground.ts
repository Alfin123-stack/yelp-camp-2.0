export interface CampgroundImage {
  url: string;
  filename: string;
  _id?: string;
}

export interface CampgroundAuthor {
  _id: string;
  username: string;
}

export interface ReviewOwner {
  _id: string;
  username: string;
}

export interface ReviewData {
  _id: string;
  body: string;
  rating: number;
  owner?: ReviewOwner;
}

export interface CampgroundData {
  _id: string;
  title: string;
  images: CampgroundImage[];
  geometry: { type: "Point"; coordinates: [number, number] };
  price: number;
  description: string;
  location: string;
  author?: CampgroundAuthor;
  reviews: ReviewData[];
}
