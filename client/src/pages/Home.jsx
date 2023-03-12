import React, { useState, useEffect } from "react";
import { Card, FormField, Loader } from "../components";

const RenderCards = ({ data, title }) => {
  if (data?.length > 0) {
    return data.map((post) => <Card key={post._id} {...post} />);
  }

  return (
    <h2 className="mt-5 font-bold text-[#6469ff] text-xl uppercase">{title}</h2>
  );
};

const Home = () => {
  const [loading, setloading] = useState(false);
  const [allPosts, setAllPosts] = useState(null);

  const [searchText, setsearchText] = useState("");
  const [searchedResult, setsearchedResult] = useState(null);
  const [searchTimeout, setsearchTimeout] = useState(null);

  const fetchPosts = async () => {
    setloading(true);

    try {
      const response = await fetch(
        "https://serverdalle-bilardoraka64.b4a.run/api/v1/post",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        setAllPosts(result.data.reverse());
      }
    } catch (err) {
      alert(err);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearchChange = (e) => {
    setsearchText(e.target.value);

    setsearchTimeout(
      setTimeout(() => {
        const searchResults = allPosts.filter(
          (item) =>
            item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.prompt.toLowerCase().includes(searchText.toLowerCase())
        );

        setsearchedResult(searchResults);
      }, 500)
    );
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">
          The Community Showcase
        </h1>
        <p className="mt-2 text-[#666E75] text-[16px] max-w-[500px]">
          Berjalan menuju koleksi foto yang imaginatif dengan visual yang
          mengagumkan di Dall-E AI Clone by{" "}
          <a
            target="_blank"
            className="text-[#6469FF] underline"
            href="https://github.com/BilardoRaka"
          >
            BRPamungkas
          </a>
        </p>
      </div>
      <div className="mt-16">
        <FormField
          labelName="Search"
          type="text"
          name="text"
          placeholder="Pencarian Gambar"
          value={searchText}
          handleChange={handleSearchChange}
        />
      </div>
      <div className="mt-10">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <>
            {searchText && (
              <h2 className="font-medium text-[#666E75] text-xl mb-3">
                Menampilkan hasil untuk{" "}
                <span className="text-[#222328]">{searchText}</span>
              </h2>
            )}
            <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grind-cols-1 gap-3">
              {searchText ? (
                <RenderCards
                  data={searchedResult}
                  title="Hasil pencarian tidak ditemukan."
                />
              ) : (
                <RenderCards data={allPosts} title="Tidak ada gambar." />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Home;
