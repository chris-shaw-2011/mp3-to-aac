import mp3ToAac from "../src/index"
import { expect } from "chai"
import fs from "fs"
import jsmediatags from "jsmediatags"
import { TagType } from "jsmediatags/types"
import { Metadata } from "../src/Options"

describe("mp3-to-aac", () => {
   it("Encoding single mp3", async () => {
      const out = "tests\\single.out.m4a"

      await removeIfExsits(out);

      await mp3ToAac("tests\\test.mp3", out)

      expect(fs.existsSync(out)).to.equal(true)

      await removeIfExsits(out);
   })

   it("Encoding multiple mp3s", async () => {
      const out = "tests\\multi.out.m4a"

      await removeIfExsits(out)

      await mp3ToAac(["tests\\test.mp3", "tests\\test.mp3"], out)

      expect(fs.existsSync(out)).to.equal(true)

      await removeIfExsits(out)
   })

   it("Metadata", async () => {
      const out = "tests\\metadata.out.m4a"
      const overrides: Metadata = {
         album: "al\"bum",
         artist: "ar\"tist",
         albumArtist: "alb\"umArtist",
         grouping: "gro\"uping",
         composer: "com\"poser",
         year: 2019,
         trackNumber: 2,
         comment: "com\"ment",
         genre: "ge\"nre",
         copyright: "copy\"right",
         description: "desc\"ription",
         synopsis: "syno\"psis",
         title: "tit\"le",
         coverPicturePath: "tests\\test.jpg"
      }

      await removeIfExsits(out)

      await mp3ToAac("tests\\test.mp3", out, {
         metaDataOverrides: overrides
      })

      var tags = (await new Promise((resolve, error) => jsmediatags.read(out, {
         onSuccess: (tags) => resolve(tags),
         onError: (e) => error(e),
      })) as TagType).tags

      expect(tags.album).to.equal(overrides.album)
      expect(tags.artist).to.equal(overrides.artist)
      expect(tags.comment).to.equal(overrides.comment)
      expect(tags.genre).to.equal(overrides.genre)
      expect(tags.title).to.equal(overrides.title)
      expect(tags.track).to.equal(overrides.trackNumber)
      expect(tags.year).to.equal(overrides.year!.toString())
      expect(tags.picture).not.be.undefined
      expect(tags.picture!.data.length).is.greaterThan(0)

      await removeIfExsits(out)
   })
})

async function removeIfExsits(file: string) {
   if (fs.existsSync(file)) {
      await fs.promises.unlink(file)
   }
}