import { Router } from "express";
import { getDiscordUser } from "../auth/discord";
import jwt from "jsonwebtoken";

const authRouter = Router();

authRouter.get("/discord/callback", async (req, res) => {
  try {
    const code = req.query.code as string;
    const state = req.query.state as string;

    if (!code) {
      return res.redirect("http://localhost:3000");
    }

    const user = await getDiscordUser(code);

    const token = jwt.sign(
      {
        discordId: user.id,
        username: user.username,
        globalName: user.global_name,
        avatar: user.avatar,
        email: user.email,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    const returnTo = state ? decodeURIComponent(state) : "/";

    res.redirect(`http://localhost:3000${returnTo}`);
  } catch (err) {
    console.error(err);
    res.redirect("http://localhost:3000");
  }
});

authRouter.get("/me", (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(200).json({ user: null });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      discordId: string;
      username: string;
      globalName: string;
      avatar: string;
    };

    res.json({
      user: {
        id: decoded.discordId,
        username: decoded.username,
        globalName: decoded.globalName,
        avatar: decoded.avatar,
      },
    });
  } catch {
    res.status(200).json({ user: null });
  }
});

authRouter.post("/logout", (_, res) => {
  res.clearCookie("token", { path: "/", httpOnly: true, secure: false, sameSite: "lax" });
  res.json({ ok: true });
});

export default authRouter;
