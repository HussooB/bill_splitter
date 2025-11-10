// src/modules/auth/auth.controller.ts
import { Request, Response } from "express";
import * as authService from "./auth.service";
import type { User } from "@prisma/client";

// Create a type that excludes the password
type SafeUser = Omit<User, "password">;

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, name }: { email: string; password: string; name: string } = req.body;
    
    // authService.signup should return { user: User, token: string }
    const result = await authService.signup(email, password, name);

    // Destructure user and token
    const { user, token } = result;

    // Strip password
    const safeUser: SafeUser = (({ password, ...u }) => u)(user);

    res.status(201).json({ user: safeUser, token });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(400).json({ error: "Unknown error occurred" });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: { email: string; password: string } = req.body;

    // authService.login should return { user: User, token: string }
    const result = await authService.login(email, password);

    const { user, token } = result;

    // Strip password
    const safeUser: SafeUser = (({ password, ...u }) => u)(user);

    res.status(200).json({ user: safeUser, token });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(400).json({ error: "Unknown error occurred" });
    }
  }
};
