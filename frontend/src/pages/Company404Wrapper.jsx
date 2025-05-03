import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Company404Page from "../pages/Company404Page";
import api from "../services/api";

export default function Company404Wrapper() {
  const { slug } = useParams();
  const [company, setCompany] = useState(null);

  useEffect(() => {
    api.get(`/companies/by-slug/${slug}`).then((res) => {
      setCompany(res.data);
    }).catch(() => {
      setCompany(null); // opcional, podrías redirigir a /404 global
    });
  }, [slug]);

  if (!company) return null; // o loading spinner

  return <Company404Page company={company} />;
}
