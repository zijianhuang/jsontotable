using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using Newtonsoft.Json;
using System.Linq;
using Fonlow.Reflection;
using System.Runtime.CompilerServices;
using System.Reflection;
namespace J2T
{
	/// <summary>
	/// Interaction logic for J2tTable.xaml
	/// </summary>
	public partial class J2tTable : UserControl
	{
		public J2tTable()
		{
			InitializeComponent();
			List<User> users = new List<User>();
			users.Add(new User() { Id = 1, Name = "John Doe", Birthday = new DateTime(1971, 7, 23) });
			users.Add(new User() { Id = 2, Name = "Jane Doe", Birthday = new DateTime(1974, 1, 17) });
			users.Add(new User() { Id = 3, Name = "Sammy Doe", Birthday = new DateTime(1991, 9, 2) });
			//this.nodeSimple.ItemsSource = users;
			var obj = JsonConvert.DeserializeObject(System.IO.File.ReadAllText(@"C:\temp\JSON\cars.json")) as IEnumerable;
			if (obj != null)
			{
				var array = obj.Cast<object>().ToArray();
				//var refined = array.Select(d => ToDictionary(d));
				this.nodeSimple.ItemsSource = array;
			}
		}

		IDictionary<string, object> ToDictionary(object source)
		{
			return source.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance | BindingFlags.DeclaredOnly).ToDictionary(
				d => d.Name,
				d => d.GetValue(source, null)
				);
		}
	}

	public class User
	{
		public int Id { get; set; }

		public string Name { get; set; }

		public DateTime Birthday { get; set; }
	}


}
