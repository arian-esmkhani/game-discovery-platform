package AuthService.service;

public enum CustomRole {
    CUSTOMER("CUSTOMER"),
    ADMIN("ADMIN");

    private final String value;

    CustomRole(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
