import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function ListElement({
  Id_oeuvre,
  Artiste,
  Titre,
  Dimension,
  Statut,
  Edition,
  Prix,
}) {
  const [checked, setChecked] = useState([]);
  const router = useRouter();

  const handleClick = () => {
    router.push(`/search/${Id_oeuvre}`);
  };

  // const handleToggle = (value) => () => {
  //   const currentIndex = checked.indexOf(value);
  //   const newChecked = [...checked];

  //   if (currentIndex === -1) {
  //     newChecked.push(value);
  //   } else {
  //     newChecked.splice(currentIndex, 1);
  //   }

  //   setChecked(newChecked);
  // };

  return (
    <tr className="border-b cursor-pointer" onClick={handleClick}>
      <td>
        <input type="checkbox" id="select" />
      </td>
      <td className="min-w-16 max-w-16 pr-[10px] py-[5px]">
        <img src="./Images/Oeuvre.png" alt="" />
      </td>
      <td className="">{Id_oeuvre}</td>

      <td>{Artiste}</td>
      <td>{Titre}</td>
      <td>{Dimension}</td>
      <td>{Statut}</td>
      <td>{Edition}</td>
      <td>{Prix} €</td>
    </tr>
  );
}
