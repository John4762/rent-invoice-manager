export function useTenants() {
  const [tenants, setTenants] = useState<Tenant[]>([]);

  useEffect(() => {
    repositories.tenant
      .getAll()
      .then(setTenants);
  }, []);

  return {
    tenants,
  };
}