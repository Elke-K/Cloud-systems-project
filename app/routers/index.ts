import e, { Router } from "express";
import { Animal } from "../types";
import {returnAnimals } from "../database";
import { error } from "console";

export function indexRouter(): Router {
  const router: Router = Router();

  router.get("/", async (req, res) => {
    const sortField: string =
      typeof req.query.sortField === "string" ? req.query.sortField : "name";
    const sortDirection: string =
      typeof req.query.sortDirection === "string"
        ? req.query.sortDirection
        : "asc";

    const search: string =
      typeof req.query.search === "string" ? req.query.search : "";

    let animalsReturned: Animal[] = await returnAnimals();
    animalsReturned = animalsReturned.filter((animal) =>
      animal.name.toLowerCase().includes(search.toLowerCase()),
    );
    animalsReturned = animalsReturned.sort((a, b) => {
      if (sortField === "name") {
        return sortDirection === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortField === "birthdate") {
        let aDate = Date.parse(a.birthDate);
        let bDate = Date.parse(b.birthDate);
        return sortDirection === "asc" ? aDate - bDate : bDate - aDate;
      } else if (sortField === "hobbies") {
        let currentIndex = 0;
        return sortDirection === "asc"
          ? a.hobbies.length - b.hobbies.length
          : b.hobbies.length - a.hobbies.length;
      } else if (sortField === "age") {
        return sortDirection === "asc" ? a.age - b.age : b.age - a.age;
      } else if (sortField === "active") {
        let aActive = 0;
        let bActive = 0;

        if (a.isActive) {
          aActive = 1;
        } else if (b.isActive) {
          bActive = 1;
        }
        return sortDirection === "asc" ? aActive - bActive : bActive - aActive;
      } else {
        return 0;
      }
    });
    res.render("index", {
      animals: animalsReturned,
      q: search,
      sortField: sortField,
      sortDirection: sortDirection,
    });
  });

  return router;
}
