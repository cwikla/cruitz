class AddColsToCompany < ActiveRecord::Migration[5.1]
  def change
    add_column :companies, :logo, :string
    add_column :companies, :logo_url, :string
    add_column :companies, :logo_uploaded_at, :timestamp
    add_column :companies, :logo_data, :text
  end
end
